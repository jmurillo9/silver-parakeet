import { main, cloud } from "@wingcloud/framework";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3-bucket";
import { S3BucketPublicAccessBlock } from "@cdktf/provider-aws/lib/s3-bucket-public-access-block";

// importing helper libraries
import { randomBytes } from "crypto";
import * as fs from "fs";

// Helper function to generate a random string
function generateRandomString(length: number): string {
  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function loadValuesFromFile(filePath: string): { deployableRegions: string[] } {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

main((root) => {
  const { deployableRegions } = loadValuesFromFile("values-nonprod.json");

  if (deployableRegions.length === 0) {
    throw new Error("No deployable regions specified in the values file.");
  }

  deployableRegions.forEach((region) => {
    const provider = new AwsProvider(root, `aws_${region}`, {
      alias: `${region}`,
      region: region
    });

    // Generate a unique random suffix for the bucket name
    const randomSuffix = generateRandomString(6);

    const bucketName = `silver-parakeet-${region}-${randomSuffix}`;

    new S3Bucket(root, `bucket_${region}`, {
      // loop through list of regions to generate a provider block for each deployableRegion
      provider: provider,

      // bucket properites
      bucket: bucketName,
      forceDestroy: true,

      // define resource tags
      tags: {
        ManagedBy: "CDKTF via Wing",
        Version: "v0.0.1",
        Platform: "jmurillo9",
        Environment: "nonprod",
        Project: "silver-parakeet",
        Region: region // Add the region to the tags for tracking
      },

      tagsAll: {
        ManagedBy: "CDKTF via Wing",
        Version: "v0.0.1",
        Platform: "jmurillo9",
        Environment: "nonprod",
        Project: "silver-parakeet",
        Region: region // Add the region to the tags for tracking
      },
    });

    new S3BucketPublicAccessBlock(root, `bucket_public_access_block_${region}`, {
      // loop through list of regions to generate a provider block for each deployableRegion
      provider: provider,

      bucket: bucketName,

      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true
    });

    // using Wing library
    const bucketProps = {
      provider: provider,
      public: false, // Set to true if you want the bucket to be public
      bucketName: `my-${region}-bucket-name`
    };
  
    // Create the S3 bucket
    new cloud.Bucket(root, `${bucketProps.bucketName}`, {
      ...bucketProps
    });
    console.log(`Bucket created with name: ${bucketProps.bucketName}`);
  });

});

