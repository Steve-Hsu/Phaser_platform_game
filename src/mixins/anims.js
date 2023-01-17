export default {
  isPlayingAnims(animsKey) {
    // Bug, this.anims.getCurrentKey() is not defined.
    return this.anims.isPlaying && this.anims.getCurrentKey() === animsKey;
  }
}