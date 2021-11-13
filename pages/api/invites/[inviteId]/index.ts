import AcceptOrgInvite from "../../../../utils/invites/acceptOrgInvite";
import InputValidation from "../../../../utils/inputValidation";
import { NextApiResponse } from "next";
import DeleteOrgInvite from "../../../../utils/invites/deleteOrgInvite";
import withCleanOrgId from "../../../../middleware/withCleanOrgId";
import { getOrgInvite } from "../../../../utils/invites/getOrgInvite";
import { withSessionRoute } from "../../../../middleware/withSession";
import CleanUser from "../../../../utils/clean/cleanUser";
import { GetUserById } from "../../../../utils/users/getUserById";
import { JoinOrgFromInvite } from "../../../../utils/orgs/joinOrgFromInvite";

const handler = async (
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> => {
  console.log(req.session);
  const userSession = req.session.user;
  if (!userSession) {
    req.session.destroy();
    return res.status(401).json({ message: "Please log in again" });
  }
  const { method, query } = req;
  const { inviteId } = query as CustomQuery;

  console.log("INvite id", req.query);
  // TODO trycatch
  const invite = await getOrgInvite(userSession.userId, inviteId);
  console.log("Got invite", invite);
  const joinOrgInput = {
    userId: userSession.userId,
    invite: invite,
  };

  try {
    InputValidation(joinOrgInput);
  } catch (error) {
    console.error("Error accepting invite", error);
    return res.status(400).json({ message: `${error.message}` });
  }

  if (method === "POST") {
    // TODO disallow orgId's by this name
    if (userSession.orgId != "NO_ORG_ASSIGNED") {
      return res.status(400).json({
        message: `You already belong to an org: ${userSession.orgId}`,
      });
    }

    try {
      await JoinOrgFromInvite({ userId: userSession.userId, invite });

      const updatedUser = await GetUserById(userSession.userId);
      req.session.user = CleanUser(updatedUser);
      await req.session.save();
      return res
        .status(200)
        .json({ message: `You've joined the ${invite.orgName} org!` });
    } catch (error) {
      return res
        .status(500) // TODO change #
        .json({
          message: `We were unable to  ${error}`,
        });
    }
  }

  if (method === "DELETE") {
    const deleteOrgInviteInput = {
      userId: userSession.userId,
      inviteId: inviteId,
    };

    try {
      InputValidation(deleteOrgInviteInput);
    } catch (error) {
      return res.status(400).json({ message: `${error.message}` });
    }

    try {
      await DeleteOrgInvite(deleteOrgInviteInput);
      return res.status(200).json({ message: "Invite rejected!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Unable to reject invite - ${error}` });
    }
  }

  return res.status(405).json({ message: "Not Allowed" });
};

export default withSessionRoute(withCleanOrgId(handler));