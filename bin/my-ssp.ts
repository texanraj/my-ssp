import { App } from '@aws-cdk/core'
import * as ssp from '@aws-quickstart/ssp-amazon-eks';

const app = new App();

// Pipeline construct
const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region };
const blueprint = ssp.EksBlueprint.builder()
  .account(account) 
  .region('us-west-2')
      
// Build code pipeline and add stages
const pipeline = ssp.CodePipelineStack.builder()
  .name("ssp-eks-workshop-pipeline")
  .owner("texanraj")
  .repository({
    repoUrl: 'my-ssp',
    credentialsSecretName: 'github-token2',
    targetRevision: 'main'
  })
  .stage({
    id: 'dev',
    stackBuilder: blueprint.clone('us-west-2')
  })
  .stage({
    id: 'test',
    stackBuilder: blueprint.clone('us-east-1')
  })
  .stage({
    id: 'prod',
    stackBuilder: blueprint.clone('us-east-2')
  })
  .build(app, 'my-first-stack', {env});
