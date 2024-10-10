// import CDKTF library 
bring tf;

// importing extra libraries
bring math;

new tf.Element({
  provider: [
    { aws: { } },
    { aws: { alias: "secondary", region: "us-west-1" } },
    { aws: { alias: "third", region: "us-east-2"} }
  ]
});

// define an array of deployable regions
let deployableRegions = ["us-east-1", "us-east-2", "us-west-1"];

// define a JSON object containing a list of tags to apply to each resource
struct Tags {
  ManagedBy: str;
  Version: str;
  Platform: str;
  Environment: str;
  Project: str;
}

let globalTags = Tags {
  ManagedBy: "CDKTF via Wing",
  Version: "v0.0.1",
  Platform: "jmurillo9",
  Environment: "nonprod",
  Project: "silver-parakeet"
};

// First, loop through the set of regions and generate the appropriate provider alias blocks in Terraform
// then, construct the following AWS resource(s) and deploy them.
for region in deployableRegions {
  log("\nDeploying to region: " + region);

  // let role = new tf.Resource({
  //   terraformResourceType: "aws_iam_role",
  //   attributes: {
  //     name: "jon-test-role-" + region,
  //     tags: globalTags,
  //     inline_policy: {
  //       name: "lambda-invoke-" + region,
  //       policy: Json.stringify({
  //         Version: "2012-10-17",
  //         Statement: [ 
  //           { 
  //             Effect: "Allow",
  //             Action: [ "lambda:InvokeFunction" ],
  //             Resource: "*" 
  //           }
  //         ]
  //       })
  //     },
  //     assume_role_policy: Json.stringify({
  //       Version: "2012-10-17",
  //       Statement: [
  //         { 
  //           Action: "sts:AssumeRole",
  //           Effect: "Allow",
  //           Principal: { Service: "states.amazonaws.com" }
  //         },
  //       ]
  //     }),
  //   }
    
  // }) as "my_role_{region}";

  // let arn = role.getStringAttribute("arn");
  // log(Json.stringify(arn));

  let bucket = new tf.Resource({
    terraformResourceType: "aws_s3_bucket",
    attributes: {

      bucket: "silver-parakeet-{region}-bucket-{math.ceil(math.random(100))}",
      force_destroy: true,
      tags: globalTags
    }
  }) as "silver_parakeet_{region}_bucket";

  // let bucketACL = new tf.Resource({
  //   terraformResourceType: "aws_s3_bucket_acl",
  //   attributes: {
  //     provider: "aws.{region}",
  //     bucket: bucket.getStringAttribute("bucket"),
  //     acl: "private"
  //   }
  // }) as "silver_parakeet_{region}_acl";
}
