import { Dynamo } from "../../libs/ddbDocClient";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
const { DYNAMO_TABLE_NAME } = process.env;

export async function GetUserByEmail(user_email: string) {
  const params: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    IndexName: "GSI2",
    KeyConditionExpression: "GSI2PK = :GSI2PK AND GSI2SK = :GSI2SK",
    ExpressionAttributeValues: {
      ":GSI2PK": user_email,
      ":GSI2SK": "USER",
    },
  };

  try {
    const response = await Dynamo.send(new QueryCommand(params));
    return response.Items[0];
  } catch (error) {
    throw new Error(error);
  }
}