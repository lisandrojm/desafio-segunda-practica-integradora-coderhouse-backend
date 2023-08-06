/* ************************************************************************** */
/* /src/components/auth/authController/authController.js - Controlador  de 
autenticación de usuarios. */
/* ************************************************************************** */

const authServices = require('../authServices/authServices');
const passport = require('passport');

class AuthController {
  register = (req, res, next) => {
    passport.authenticate('register', { failureRedirect: '/failregister' })(req, res, next);
  };

  registerSuccess = (req, res) => {
    res.send({ status: 'success', message: 'User registered' });
  };

  failRegister = async (req, res) => {
    console.log('Failed Strategy');
    res.send({ error: 'Failed Register' });
  };

  login = (req, res, next) => {
    passport.authenticate('login', (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error durante el inicio de sesión' });
      }
      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }

      if (user.admin) {
        res.cookie('username', user.email, { maxAge: 20000, httpOnly: true, signed: true });
        req.session.user = user;
        req.session.admin = true;
        return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', userType: 'admin' });
      } else {
        res.cookie('username', user.email, { maxAge: 20000, httpOnly: true, signed: true });
        req.session.user = user;
        if (req.session.hasOwnProperty('admin')) {
          delete req.session.admin;
        }

        return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', userType: 'user', user });
      }
    })(req, res, next);
  };

  logout = async (req, res) => {
    const logoutResult = await authServices.logout(req, res);
    if (logoutResult.success) {
      return res.redirect('/');
    } else {
      return res.status(401).json(logoutResult);
    }
  };

  githubLogin = (req, res, next) => {
    passport.authenticate('github', { scope: ['user_email'] })(req, res, next);
  };

  githubCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' })(req, res, next);
  };

  githubCallbackRedirect = (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  };
}

module.exports = new AuthController();
