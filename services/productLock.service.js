const redis = require("../redis");

const lockProduct = async (key, sessionId, ttlSeconds) => {
    return await redis.set(key, sessionId, "NX", "EX", ttlSeconds);
};

const unlockProduct = async (key, sessionId) => {
    const current = await redis.get(key);
    if (current === sessionId) {
        await redis.del(key);
    }
};

const getLockOwner = async (key) => {
    return await redis.get(key);
};

module.exports = {
    lockProduct,
    unlockProduct,
    getLockOwner
};
