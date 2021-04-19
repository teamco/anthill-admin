import i18n from '@/utils/i18n';
import request from '@/utils/request';
import { API } from '@/services/config';
import { errorDeleteMsg, errorGetMsg, errorSaveMsg } from '@/utils/message';
import { getXHRToken } from '@/services/auth.service';

/**
 * @export
 * @param {{metadata:{roles:{superadmin_role}}}} user
 * @return {*}
 */
export const isAdmin = (user) => {
  return user?.metadata?.roles?.superadmin_role;
};

/**
 * @export
 * @param {{metadata:{roles:{supervisor_role}}}} user
 * @return {*}
 */
export const isModerator = (user) => {
  return user?.metadata?.roles?.supervisor_role;
};

/**
 * @export
 * @param token
 * @return {Q.Promise<*>|undefined}
 */
export function getCurrentUser({ token }) {
  const opts = request.config({
    url: API.auth.currentUser,
    headers: { 'Authorization': getXHRToken({ token }) }
  });

  return request.xhr(opts,
    (error) => errorGetMsg(i18n.t('instance:user'), error),
    '/home'
  );
}

/**
 * @export
 * @param email
 * @param password
 * @param name
 * @param key
 * @return {Q.Promise<*>|undefined}
 */
export function registerUser({ email, password, name, key }) {
  const opts = request.config({
    url: API.auth.registerUser,
    method: 'post',
    direct: true,
    data: {
      email,
      password,
      name,
      key
    }
  });

  return request.xhr(opts,
    (error) => errorSaveMsg(false, i18n.t('instance:user'), error),
    '/home'
  );
}

/**
 * @export
 * @param token
 * @return {Q.Promise<*>|undefined}
 */
export function getUsers({ token }) {
  const opts = request.config({
    url: API.users.getAllUsers,
    headers: { 'Authorization': getXHRToken({ token }) }
  });

  return request.xhr(opts,
    (error) => errorGetMsg(i18n.t('menu:users'), error),
    '/home'
  );
}

/**
 * @export
 * @param id
 * @param token
 * @return {Q.Promise<*>|undefined}
 */
export function getUser({ key, token }) {
  const opts = request.config({
    url: API.users.getUser,
    headers: { 'Authorization': getXHRToken({ token }) },
    key
  });

  return request.xhr(opts,
    (error) => errorGetMsg(i18n.t('instance:user'), error),
    '/home'
  );
}

/**
 * @export
 * @async
 * @param {string} email
 * @param {string} protocol
 * @param {string} format
 * @return {Promise<*>}
 */
export async function getProfileImage({ email, protocol = 'http', format = 'json' }) {
  const gravatar = require('gravatar');
  return await gravatar.url(email, { protocol, format });
}

/**
 * @export
 * @async
 * @param entityForm
 * @param fileList
 * @param tags
 * @param removeFile
 * @param token
 * @return {Promise<*|undefined>}
 */
export const updateUserProfile = async ({ entityForm, fileList = [], tags = [], removeFile, token }) => {
  const opts = request.config({
    url: API.users.updateUser,
    headers: { 'Authorization': getXHRToken({ token }) },
    key: entityForm.entityKey,
    method: 'put'
  });

  const profile_image = fileList[0] ? await request.toBase64(fileList[0]) : undefined;

  return request.xhr({
      ...opts,
      ...{
        data: {
          user: {
            name: entityForm.name,
            key: entityForm.entityKey,
            remove_profile_image: removeFile,
            profile_image
          }
        }
      }
    },
    (error) => errorSaveMsg(true, i18n.t('instance:user'), error)
  );
};

/**
 * @export
 * @param key
 * @param token
 * @return {Promise<*|undefined>}
 */
export const forceSignOut = async ({ key, token }) => {
  const opts = request.config({
    url: API.auth.forceLogout,
    headers: { 'Authorization': getXHRToken({ token }) },
    method: 'post'
  });

  return request.xhr({
      ...opts,
      ...{ data: { key } }
    },
    (error) => errorSaveMsg(true, i18n.t('instance:user'), error)
  );
};

/**
 * @export
 * @param key
 * @param token
 * @return {Promise<*|undefined>}
 */
export const deleteUser = async ({ key, token }) => {
  const opts = request.config({
    url: API.users.deleteUser,
    headers: { 'Authorization': getXHRToken({ token }) },
    method: 'delete',
    key
  });

  return request.xhr(opts,
    (error) => errorDeleteMsg(true, i18n.t('instance:user'), error)
  );
};
