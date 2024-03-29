
import { colors } from '../colors';

export class Match {

    constructor(obj: any) {
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
    }

    rows: number;
    columns: number;
    items: number;
    gameArray?: { value: number, isEmpty: boolean, row: number; column: number, customData?: any }[][];
    selectedItem?: any;

    // generates the game field
    public generateField (): void {
        this.gameArray = [];
        this.selectedItem = false;
        for (let i = 0; i < this.rows; i ++) {
            this.gameArray[i] = [];
            for (let j = 0; j < this.columns; j ++) {
                do {
                    // let randomValue = Math.floor(Math.random() * this.items);
                    let randomValue = colors[Phaser.Math.RND.between(0, colors.length - 1)];
                    this.gameArray[i][j] = {
                        value: randomValue,
                        isEmpty: false,
                        row: i,
                        column: j
                    }
                } while(this.isPartOfMatch(i, j));
            }
        }
        if (this.firstOptionInBoard()) {
          console.log('option found');
        } else {
          this.generateField();
        }
    }

    // returns true if there is a match in the board
    public matchInBoard (): boolean {
        for(let i = 0; i < this.rows; i ++){
            for(let j = 0; j < this.columns; j ++){
                if(this.isPartOfMatch(i, j)){
                    return true;
                }
            }
        }
        return false;
    }

    // returns true if the item at (row, column) is part of a match
    private isPartOfMatch (row: number, column: number): boolean {
        return this.isPartOfHorizontalMatch(row, column) || this.isPartOfVerticalMatch(row, column);
    }

    // returns true if the item at (row, column) is part of an horizontal match
    private isPartOfHorizontalMatch (row: number, column: number): boolean {
        return this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column - 2) ||
                this.valueAt(row, column) === this.valueAt(row, column + 1) && this.valueAt(row, column) === this.valueAt(row, column + 2) ||
                this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column + 1);
    }

    // returns true if the item at (row, column) is part of an vertical match
    private isPartOfVerticalMatch (row: number, column: number): boolean {
        return this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row - 2, column) ||
                this.valueAt(row, column) === this.valueAt(row + 1, column) && this.valueAt(row, column) === this.valueAt(row + 2, column) ||
                this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row + 1, column)
    }

    // returns the value of the item at (row, column), or false if it's not a valid pick
    public valueAt (row: number, column: number): any {
        if(!this.validPick(row, column)){
            return false;
        }
        return this.gameArray[row][column].value;
    }

    public getValue (row: number, column: number): number {
        return this.gameArray[row][column].value;
    }

    // returns true if the item at (row, column) is a valid pick
    public validPick (row: number, column: number): boolean {
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    // returns the number of board rows
    public getRows (): number {
        return this.rows;
    }

    // returns the number of board columns
    public getColumns (): number {
        return this.columns;
    }

    // sets a custom data on the item at (row, column)
    public setCustomData (row: number, column: number, customData: any): void {
        this.gameArray[row][column].customData = customData;
    }

    // returns the custom data of the item at (row, column)
    public customDataOf (row: number, column: number): any {
        return this.gameArray[row][column].customData;
    }

    // returns the selected item
    public getSelectedItem (): any {
        return this.selectedItem;
    }

    // set the selected item as a {row, column} object
    public setSelectedItem (row: number, column: number): void {
        this.selectedItem = {
            row: row,
            column: column
        }
    }

    // deleselects any item
    public deleselectItem (): void {
        this.selectedItem = false;
    }

    // checks if the item at (row, column) is the same as the item at (row2, column2)
    public areTheSame (row: number, column: number, row2: number, column2: number): boolean {
        return row == row2 && column == column2;
    }

    // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally or vertically
    public areNext (row: number, column: number, row2: number, column2: number): boolean {
        return Math.abs(row - row2) + Math.abs(column - column2) == 1;
    }

    // swap the items at (row, column) and (row2, column2) and returns an object with movement information
    public swapItems (row: number, column: number, row2: number, column2: number): any {
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
        return [{
            row: row,
            column: column,
            deltaRow: row - row2,
            deltaColumn: column - column2
        },
        {
            row: row2,
            column: column2,
            deltaRow: row2 - row,
            deltaColumn: column2 - column
        }]
    }

    // return the items part of a match in the board as an array of {row, column} object
    public getMatchList (): any {
        let matches = [];
        for(let i = 0; i < this.rows; i ++){
            for(let j = 0; j < this.columns; j ++){
                if(this.isPartOfMatch(i, j)){
                    matches.push({
                        row: i,
                        column: j
                    });
                }
            }
        }
        return matches;
    }

    // removes all items forming a match
    public removeMatches (): void {
        let matches = this.getMatchList();
        matches.forEach(function(item: any){
            this.setEmpty(item.row, item.column)
        }.bind(this))
    }

    // set the item at (row, column) as empty
    private setEmpty (row: number, column: number): void{
        this.gameArray[row][column].isEmpty = true;
    }

    // returns true if the item at (row, column) is empty
    private isEmpty (row: number, column: number): boolean {
        return this.gameArray[row][column].isEmpty;
    }

    // returns the amount of empty spaces below the item at (row, column)
    private emptySpacesBelow (row: number, column: number): number {
        let result = 0;
        if(row != this.getRows()){
            for(let i = row + 1; i < this.getRows(); i ++){
                if(this.isEmpty(i, column)){
                    result ++;
                }
            }
        }
        return result;
    }

    // arranges the board after a match, making items fall down. Returns an object with movement information
    public arrangeBoardAfterMatch (): any {
        let result = []
        for(let i = this.getRows() - 2; i >= 0; i --){
            for(let j = 0; j < this.getColumns(); j ++){
                let emptySpaces = this.emptySpacesBelow(i, j);
                if(!this.isEmpty(i, j) && emptySpaces > 0){
                    this.swapItems(i, j, i + emptySpaces, j)
                    result.push({
                        row: i + emptySpaces,
                        column: j,
                        deltaRow: emptySpaces,
                        deltaColumn: 0
                    });
                }
            }
        }
        return result;
    }

    // replenished the board and returns an object with movement information
    public replenishBoard (): any {
        let result = [];
        for(let i = 0; i < this.getColumns(); i ++){
            if(this.isEmpty(0, i)){
                let emptySpaces = this.emptySpacesBelow(0, i) + 1;
                for(let j = 0; j < emptySpaces; j ++){
                    let randomValue = colors[Phaser.Math.RND.between(0, colors.length - 1)];
                    // let randomValue = Math.floor(Math.random() * this.items);
                    result.push({
                        row: j,
                        column: i,
                        deltaRow: emptySpaces,
                        deltaColumn: 0
                    });
                    this.gameArray[j][i].value = randomValue;
                    this.gameArray[j][i].isEmpty = false;
                }
            }
        }
        return result;
    }

    // returns true if there is a option in the board
    public firstOptionInBoard (): boolean {
        for(let i = 0; i < this.rows; i ++){
            for(let j = 0; j < this.columns; j ++){
                if(this.isPartOfOption(i, j)){
                    return true;
                }
            }
        }
        return false;
    }

    private isPartOfOption (row: number, column: number): boolean {
        return this.isPartOfVerticalOption(row, column) || this.isPartOfHorizontalOption(row, column);
    }

    // returns true if the item at (row, column) is part of an vertical option
    private isPartOfVerticalOption (row: number, column: number): boolean {
        return this.valueAt(row, column) === this.valueAt(row - 1, column + 1) && this.valueAt(row, column) === this.valueAt(row - 2, column + 1) ||
            this.valueAt(row, column) === this.valueAt(row - 2, column) && this.valueAt(row, column) === this.valueAt(row - 3, column) ||
            this.valueAt(row, column) === this.valueAt(row - 1, column - 1) && this.valueAt(row, column) === this.valueAt(row - 2, column - 1) ||
            this.valueAt(row, column) === this.valueAt(row + 1, column + 1) && this.valueAt(row, column) === this.valueAt(row + 2, column + 1) ||
            this.valueAt(row, column) === this.valueAt(row + 2, column) && this.valueAt(row, column) === this.valueAt(row + 3, column) ||
            this.valueAt(row, column) === this.valueAt(row + 1, column - 1) && this.valueAt(row, column) === this.valueAt(row + 2, column - 1) ||
            this.valueAt(row, column) === this.valueAt(row - 1, column + 1) && this.valueAt(row, column) === this.valueAt(row + 1, column + 1) ||
            this.valueAt(row, column) === this.valueAt(row - 1, column - 1) && this.valueAt(row, column) === this.valueAt(row + 1, column - 1);
    }

    // returns true if the item at (row, column) is part of an horizontal option
    private isPartOfHorizontalOption (row: number, column: number): boolean {
        return this.valueAt(row, column) === this.valueAt(row - 1, column - 1) && this.valueAt(row, column) === this.valueAt(row - 1, column - 2) ||
            this.valueAt(row, column) === this.valueAt(row, column - 2) && this.valueAt(row, column) === this.valueAt(row, column -3) ||
            this.valueAt(row, column) === this.valueAt(row + 1, column - 1) && this.valueAt(row, column) === this.valueAt(row + 1, column - 2) ||
            this.valueAt(row, column) === this.valueAt(row - 1, column + 1) && this.valueAt(row, column) === this.valueAt(row - 1, column + 2) ||
            this.valueAt(row, column) === this.valueAt(row, column + 2) && this.valueAt(row, column) === this.valueAt(row, column + 3) ||
            this.valueAt(row, column) === this.valueAt(row + 1, column + 1) && this.valueAt(row, column) === this.valueAt(row + 1, column + 2) ||
            this.valueAt(row, column) === this.valueAt(row - 1, column - 1) && this.valueAt(row, column) === this.valueAt(row - 1, column + 1) ||
            this.valueAt(row, column) === this.valueAt(row + 1, column - 1) && this.valueAt(row, column) === this.valueAt(row + 1, column + 1);
    }

    public getFirstOptionCoord (): {i: number, j: number} {
        for(let i = 0; i < this.rows; i ++){
            for(let j = 0; j < this.columns; j ++){
                if(this.isPartOfOption(i, j)){
                    return {i: i, j: j}
                }
            }
        }
        // return false;
    }
}