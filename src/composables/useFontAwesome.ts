import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faSliders,
  faFolderPlus,
  faReceipt,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";

// Add the icons to the library
library.add(faSliders, faFolderPlus, faReceipt, faMoneyBillTransfer);

export function useFontAwesome() {
  return {
    FontAwesomeIcon,
  };
}
