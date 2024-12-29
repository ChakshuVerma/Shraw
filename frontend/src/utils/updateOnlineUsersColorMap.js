import getRandomDarkColor from "@/utils/getRandomDarkColor";

const updateOnlineUsersColorMap = ({ colorMap, usersList }) => {
  let tempColorMap = colorMap ?? {};
  usersList.forEach((user) => {
    if (!tempColorMap[user.socketId]) {
      tempColorMap[user.socketId] = getRandomDarkColor();
    }
  });
  const onlineSocketIds = new Set(usersList.map((user) => user.socketId));
  Object.keys(tempColorMap).forEach((socketId) => {
    if (!onlineSocketIds.has(socketId)) {
      delete tempColorMap[socketId];
    }
  });
  return tempColorMap;
};

export default updateOnlineUsersColorMap;
