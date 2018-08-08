const Cookies = require('cookies');
const onHeaders = require('on-headers');

function cookieSession({ keys, name = 'session' }, {
  signed = true,

}) {
  return (req, res, next) => {
    const cookies = new Cookies(req, res, {
      keys,
    });

    let session;

    function getSession() {
      if (session) {
        return session;
      }
      try {
        session = JSON.parse(cookies.get(name, {
          signed,
        }));
        return session;
      } catch (e) {
        return undefined;
      }
    }

    function setSession(value) {
      session = value;
      return value;
    }

    Object.defineProperty(req, 'session', {
      configurable: true,
      enumerable: true,
      get: getSession,
      set: setSession,
    });

    onHeaders(res, () => {
      if (session) {
        cookies.set(name, Buffer.from(session), {
          signed,
        });
      }
    });


    next();
  };
}

module.exports = cookieSession;
