/*
 * type class
 * name ViewController
 */
"use strict";

class ViewController {
  constructor() {
    this.teamsPerMatchElm = document.getElementById('teamsPerMatch');
    this.numberOfTeamsElm = document.getElementById('numberOfTeams');
    this.winnerElm = document.getElementById('winner');
    this.matchContainerElm = document.getElementById('matchUpsContainer');
    this.timingElm = document.getElementById('timing');
    this.timing = null;
  }

  ////////// public functions ////////////

  /*
   * type function
   * name clear
   * purpose: clear winner and matchs contents
   */
  clear() {
    this.winnerElm.innerHTML = '';
    this.matchContainerElm.innerHTML = '';

    if (this.timing) {
      clearInterval(this.timing);
    }
  }

  /*
   * type function
   * name getTeamsPerMatch
   * return DOM Element
   */
  getTeamsPerMatch() {
    return parseInt(this.teamsPerMatchElm.value, 10);
  }

  /*
   * type function
   * name getNumberOfTeamsElmID
   * return DOM Element
   */
  getNumberOfTeamsElmID() {
    return parseInt(this.numberOfTeamsElm.value, 10);
  }

  /*
   * type function
   * name createMatchs
   * param matchsCount {Number}
   * purpose create square for each match
   */
  createMatchs(matchsCount) {
    let seconds = 1;

    if (this.timing) {
      clearInterval(this.timing);
    }

    this.timing = setInterval(
      () => this.timingElm.innerHTML = `<h2>${++seconds}</h2>`,
      1000
    );

    for(let i = 0; i < matchsCount; i++){
      let matchSquare = document.createElement('div');

      matchSquare.id = `match-${i}`;
      matchSquare.className = 'square';

      this.matchContainerElm.appendChild(matchSquare);
    }
  }

  /*
   * type function
   * name markMatchComplete
   * param id {Number}
   * purpose change background to gray means getting winner for the match
   */
  markMatchComplete(id) {
    let teamElm = document.getElementById(`match-${id}`);

    if (teamElm){
      teamElm.style.background = 'gray';
    }
  }

  /*
   * type function
   * name showWinner
   * param team {Object}
   * purpose show up winner team name
   */
  showWinner(team) {
    let showWinnerElm = document.createElement('h4');
    showWinnerElm.innerHTML = `${team.name}`;

    this.winnerElm.appendChild(showWinnerElm);
    clearInterval(this.timing);
  }
}

//export default ViewController;
const viewController = new ViewController();
