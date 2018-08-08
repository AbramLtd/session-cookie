const Cookies = require('cookies');

const Session = require('./src/session');

function cookieSession({
  keys,
  name = 'session',
  redis = undefined,
  signed = true,
  maxAge = 30 * 24 * 60 * 60 * 1000,
}) {
  if (!redis) {
    throw new Error('');
  }
  const session = new Session(redis, maxAge);

  return (req, res, next) => {
    const cookies = new Cookies(req, res, {
      keys,
    });


    function getSession() {
      try {
        const id = cookies.get(name, {
          signed,
        });
        if (!id) {
          return undefined;
        }
        return session.get(id);
      } catch (e) {
        return undefined;
      }
    }

    function setSession(value) {
      if (!value.id || !value.data) {
        throw new Error('');
      }
      cookies.set(name, value.id, {
        signed,
        maxAge,
      });
      return session.set(value.id, value.data);
    }

    Object.defineProperty(req, 'session', {
      configurable: true,
      enumerable: true,
      get: getSession,
      set: setSession,
    });

    next();
  };
}

module.exports = cookieSession;
