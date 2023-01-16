export default {
  isPlayingAnims(animsKey) {
    return this.anims.isPlayingAnims && this.anims.getCurrentKey() === animsKey;
  }
}