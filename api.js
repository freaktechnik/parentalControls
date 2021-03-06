"use strict";
const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyServiceGetter(this, "ParentalControls",
  "@mozilla.org/parental-controls-service;1", "nsIParentalControlsService");

class parentalControls extends ExtensionAPI {
  getAPI(context) {
    const { extension } = context;
    const buildPermissionURI = (reason) => extension.getURL('/') + encodeURIComponent(reason);
    return {
      parentalControls: {
        async getStatus() {
          return ParentalControls.parentalControlsEnabled;
        },
        async requestPermission(reason) {
          if (!ParentalControls.parentalControlsEnabled) {
            return true;
          }

          const permissionURI = buildPermissionURI(reason);
          // This may be sync and blocking. Any way to get around that?
          return ParentalControls.requestURIOverride(permissionURI, context.contentWindow);
        }
      }
    };
  }
}
