
import BaseScene from "./BaseScene";

class CreditsScene extends BaseScene {
  constructor(config) {
    super('CreditsScene', { ...config, canGoBack: true });
    this.menu = [
      { scene: null, text: 'finished the game' },
      { scene: null, text: 'Author: Filip' },
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, () => { });
  }
}

export default CreditsScene;