/* ************************************************************************** */
/* /src/components/auth/authServices/authServices.js -  servicios de los usuarios. */
/* ************************************************************************** */

class AuthServices {
  logout = async (req, res) => {
    try {
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            const response = { success: false, error: err };
            req.logoutResult = response;
            reject(response);
          } else {
            const response = { success: true, message: 'Logout exitoso' };
            req.logoutResult = response;
            resolve(response);
          }
          console.log('Logout success');
        });
      });

      return req.logoutResult;
    } catch (err) {
      const response = { success: false, error: 'Error durante el logout' };
      req.logoutResult = response;
      return response;
    }
  };
}

module.exports = new AuthServices();
