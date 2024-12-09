import cron from "node-cron";
import User from "../models/user.models.js";

const removeUnverifiedUsers = async () => {
  console.log("Running cron job to remove unverified users.");
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  try {
    const deletedUsers = await User.deleteMany({
      isVerified: false,
      updatedAt: { $lt: oneDayAgo },
    });
    console.log(`${deletedUsers.deletedCount} unconfirmed users deleted.`);
  } catch (err) {
    console.log(err);
  }
};

const cronWrapper = () => {
  // A cron job that runs every hour to remove unverified users who have not verified their email in the last 24 hours
  cron.schedule("0 * * * *", removeUnverifiedUsers);
};

export default cronWrapper;
