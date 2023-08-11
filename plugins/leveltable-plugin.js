import LevelTable from './leveltable.js'

class LevelTablePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
    }

    add(config) {
        return new LevelTable(config);
    }
}

export default LevelTablePlugin;