// All public openings for the org
import withCleanOrgId from "../../../../../../middleware/withCleanOrgId";
import { NextApiResponse } from "next";
import { GetAllOpeningsInOrg } from "../../../../../../utils/openings/getAllOpeningsInOrg";
import CleanOpening from "../../../../../../utils/clean/cleanOpening";

const handler = async (req: CustomRequest, res: NextApiResponse) => {
  const { method, query } = req;
  const { orgId } = query as CustomQuery;

  if (method === "GET") {
    try {
      const allOpenings = await GetAllOpeningsInOrg(orgId);
      const publicOpenings = allOpenings.filter(
        (opening): DynamoOpening => opening.isPublic
      );

      publicOpenings.forEach((opening) =>
        CleanOpening(opening as DynamoOpening)
      );

      return res.status(200).json(publicOpenings);
    } catch (error) {
      // TODO add error logger
      return res
        .status(400) // TODO change #
        .json({ message: `Unable to retrieve org: ${error}` });
    }
  }

  return res.status(405).json({ message: "Not Allowed" });
};

export default withCleanOrgId(handler);