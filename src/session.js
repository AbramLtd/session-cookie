class Session {
  constructor(redis, maxAge) {
    this.client = redis;
    this.maxAge = maxAge;
  }

  async get(id) {
    return new Promise((resolve, reject) => { // eslint-disable-line prefer-arrow-callback
      this.client.get(id, (err, result) => {
        if (err !== null) {
          reject(err);
        } else if (result !== null) {
          resolve(JSON.parse(result));
        } else {
          resolve(null);
        }
      });
    });
  }

  async set(id, data) {
    return new Promise(async (resolve, reject) => { // eslint-disable-line prefer-arrow-callback
      try {
        this.client.setex(id, this.maxAge, JSON.stringify(data));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}


module.exports = Session;
