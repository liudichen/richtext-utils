import { customAlphabet } from 'nanoid';

const urlAlphabet = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict';

/** Generate secure URL-friendly unique ID.
By default, the ID will have 21 symbols to have a collision probability similar to UUID v4
* @param size — Size of the ID. The default size is 21.

* @return — A random string.
 */
export const nanoid = customAlphabet(urlAlphabet, 21);
export {
  customAlphabet,
};
