"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyConstruct = void 0;
const framework_1 = require("@wingcloud/framework");
const provider_1 = require("@cdktf/provider-aws/lib/provider");
const s3_bucket_1 = require("@cdktf/provider-aws/lib/s3-bucket");
const s3_bucket_public_access_block_1 = require("@cdktf/provider-aws/lib/s3-bucket-public-access-block");
// importing helper libraries
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
// Helper function to generate a random string
function generateRandomString(length) {
    return (0, crypto_1.randomBytes)(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
function loadValuesFromFile(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}
class MyConstruct extends framework_1.Construct {
    bucket;
    constructor(scope, id) {
        super(scope, id);
        new provider_1.AwsProvider(this, "provider", {
            alias: "us-east-2",
            region: "us-east-2"
        });
        this.bucket = new framework_1.cloud.Bucket(this, "MyBucket", {
            public: false,
        });
    }
}
exports.MyConstruct = MyConstruct;
(0, framework_1.main)((root) => {
    const { deployableRegions } = loadValuesFromFile("values-nonprod.json");
    if (deployableRegions.length === 0) {
        throw new Error("No deployable regions specified in the values file.");
    }
    deployableRegions.forEach((region) => {
        const provider = new provider_1.AwsProvider(root, `aws_${region}`, {
            alias: `${region}`,
            region: region
        });
        // Generate a unique random suffix for the bucket name
        const randomSuffix = generateRandomString(6);
        const bucketName = `silver-parakeet-${region}-${randomSuffix}`;
        new s3_bucket_1.S3Bucket(root, `bucket_${region}`, {
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
        new s3_bucket_public_access_block_1.S3BucketPublicAccessBlock(root, `bucket_public_access_block_${region}`, {
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
        new framework_1.cloud.Bucket(root, `${bucketProps.bucketName}`, {
            ...bucketProps
        });
        console.log(`Bucket created with name: ${bucketProps.bucketName}`);
    });
});
//# sourceMappingURL=main.js.map