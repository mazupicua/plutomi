import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { GetUserByEmail } from "../users/getUserByEmail";
import { Dynamo } from "../../libs/ddbDocClient";

const { DYNAMO_TABLE_NAME } = process.env;
export async function GetLatestLoginCode(user_email: string) {
  const user = await GetUserByEmail(user_email);
  const params: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `USER#${user.user_id}`,
      ":sk": "LOGIN_CODE#",
    },
    ScanIndexForward: false,
    Limit: 1,
  };

  try {
    const response = await Dynamo.send(new QueryCommand(params));
    const latest_code = response.Items[0];
    return latest_code;
  } catch (error) {
    throw new Error(error);
  }
}