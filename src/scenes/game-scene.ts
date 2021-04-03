import { Match } from '../models/match';
import { Tile } from '../models/tile';
import { colors } from '../colors';

let game;
let gameOptions = {
    gemSize: 71,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    boardOffset: {
        x: 0,
        y: 0
    }
}

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    match: Match;
    canPick: boolean;
    dragging: boolean;
    poolArray: [];
    swappingGems: number;
    selectedGem: any;

    create () {
        this.match = new Match({
            rows: 8,
            columns: 8,
            items: 6
        });

        this.match.generateField();
        this.canPick = true;
        this.dragging = false;
        this.drawField();
        this.input.on("pointerdown", this.gemSelect, this);
    }
    
    private drawField (): void{
        this.poolArray = [];
        for(let i = 0; i < this.match.getRows();i ++){
            for(let j = 0; j < this.match.getColumns(); j++){
                // let gemX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
                // let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2;
                let gemX = j * 75;
                let gemY = i * 75;
                let gem = new Tile(this, gemX, gemY, gameOptions.gemSize, gameOptions.gemSize, this.match.getValue(i, j));
                this.match.setCustomData(i, j, gem);
            }
        }
    }

    private gemSelect (pointer: any) {
        if (this.canPick) {
            this.dragging = true;
            let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / (gameOptions.gemSize + 4));
            let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / (gameOptions.gemSize + 4));
            if(this.match.validPick(row, col)){
                this.selectedGem = this.match.getSelectedItem();
                if (!this.selectedGem) {
                    this.match.customDataOf(row, col).setStrokeStyle(2, 0x33ee33);
                    this.match.setSelectedItem(row, col);
                }
                else {
                    if (this.match.areTheSame(row, col, this.selectedGem.row, this.selectedGem.column)) {
                        this.match.customDataOf(row, col).setStrokeStyle(0);
                        this.match.deleselectItem();
                    }
                    else {
                        if (this.match.areNext(row, col, this.selectedGem.row, this.selectedGem.column)) {
                            this.match.customDataOf(this.selectedGem.row, this.selectedGem.column).setStrokeStyle(0);
                            this.match.deleselectItem();
                            this.swapGems(row, col, this.selectedGem.row, this.selectedGem.column, true);
                        }
                        else {
                            this.match.customDataOf(this.selectedGem.row, this.selectedGem.column).setStrokeStyle(0);
                            this.match.customDataOf(row, col).setStrokeStyle(2, 0x33ee33);
                            this.match.setSelectedItem(row, col);
                        }
                    }
                }
            }
        }
    }

    private swapGems (row: number, col: number, row2: number, col2: number, swapBack: boolean): void {
        let movements = this.match.swapItems(row, col, row2, col2);
        this.swappingGems = 2;
        this.canPick = false;
        movements.forEach(function(movement: any){
            this.tweens.add({
                targets: this.match.customDataOf(movement.row, movement.column),
                x: this.match.customDataOf(movement.row, movement.column).x + (gameOptions.gemSize + 4) * movement.deltaColumn,
                y: this.match.customDataOf(movement.row, movement.column).y + (gameOptions.gemSize + 4) * movement.deltaRow,
                duration: gameOptions.swapSpeed,
                callbackScope: this,
                onComplete: function(){
                    this.swappingGems --;
                    if(this.swappingGems == 0){
                        if(!this.match.matchInBoard()){
                            if(swapBack){
                                this.swapGems(row, col, row2, col2, false);
                            }
                            else{
                                this.canPick = true;
                            }
                        }
                        else{
                            this.handleMatches();
                        }
                    }
                }
            })
        }.bind(this))
    }

    private handleMatches (): any {
        let gemsToRemove = this.match.getMatchList();
        let destroyed = 0;
        gemsToRemove.forEach(function(gem: any){
            this.poolArray.push(this.match.customDataOf(gem.row, gem.column))
            destroyed ++;
            this.tweens.add({
                targets: this.match.customDataOf(gem.row, gem.column),
                alpha: 0,
                duration: gameOptions.destroySpeed,
                callbackScope: this,
                onComplete: function(event: any, sprite: any){
                    destroyed --;
                    if(destroyed == 0){
                        this.makeGemsFall();
                    }
                }
            });
        }.bind(this));
    }

    private makeGemsFall () {
        let moved = 0;
        this.match.removeMatches();
        let fallingMovements = this.match.arrangeBoardAfterMatch();
        fallingMovements.forEach(function(movement: any){
            moved ++;
            this.tweens.add({
                targets: this.match.customDataOf(movement.row, movement.column),
                y: this.match.customDataOf(movement.row, movement.column).y + movement.deltaRow * (gameOptions.gemSize + 4),
                duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved == 0){
                        this.endOfMove();
                    }
                }
            })
        }.bind(this));
        let replenishMovements = this.match.replenishBoard();
        replenishMovements.forEach(function(movement: any){
            moved ++;
            let tile = this.poolArray.pop();
            tile.alpha = 1;
            tile.y = gameOptions.boardOffset.y - 37.5 + (gameOptions.gemSize + 4) * (movement.row - movement.deltaRow + 1) - (gameOptions.gemSize + 4) / 2;
            tile.x = gameOptions.boardOffset.x - 37.5 + (gameOptions.gemSize + 4) * movement.column + (gameOptions.gemSize + 4) / 2;
            tile.fillColor = this.match.valueAt(movement.row, movement.column);
            this.match.setCustomData(movement.row, movement.column, tile);
            this.tweens.add({
                targets: tile,
                y: gameOptions.boardOffset.y - 37.5 + (gameOptions.gemSize + 4) * movement.row + (gameOptions.gemSize + 4) / 2,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function(){
                    moved --;
                    if(moved == 0){
                        this.endOfMove();
                    }
                }
            });
        }.bind(this));
    }
    
    private endOfMove (): void {
    if (this.match.matchInBoard()) {
        this.time.addEvent({
            delay: 250,
            callback: this.handleMatches()
        });
    }
    else {
        this.canPick = true;
        this.selectedGem = null;
    }
}
}