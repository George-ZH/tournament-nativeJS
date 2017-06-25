// Edit me.
// Feel free to add other JS files in this directory as you see fit.
/*
 *
 */
"use strict";

// import {ViewController} from './viewController';
// import {httpService} from './httpService';

class TournamentController {
  constructor(){
    this.prefix = '[TournamentController]';
    this.matchs = {};
    this.winner = [];
    this.tournamentId = undefined;
    this.round = 0;
    this.numberOfRounds = 1;
    this.currentMatchId = 1;
  }

  Start() {
    viewController.clear();

    // get user type value
    this.teamsPerMatch = parseInt(viewController.getTeamsPerMatch(), 10);
    this.numberOfTeams = parseInt(viewController.getNumberOfTeamsElmID(), 10);

    // count games
    this.numberOfRounds = this.countNumberOfRounds();
    viewController.createMatchs(this.countNumberOfGames());

    // retrieve data from server
    this.getTournament(this.teamsPerMatch, this.numberOfTeams);
  }

  countNumberOfGames() {
    // a1 * (1-q(n-1)) / (1 - q)
    return this.teamsPerMatch*(1-Math.pow(this.teamsPerMatch, this.numberOfRounds-1))/(1-this.teamsPerMatch) + 1;
  }

  countCurrentRoundMatchId(round, currentMatchId) {
    if (round === 0){
      return currentMatchId;
    }

    return (currentMatchId % this.teamsPerMatch);
  }

  countNumberOfRounds(teamsPerMatch, numberOfTeams) {
    let rounds = 1;
    let teamCount;

    for(teamCount = this.teamsPerMatch; teamCount < this.numberOfTeams; teamCount *= this.teamsPerMatch) {
      rounds++;
    }

    return teamCount === this.numberOfTeams ? rounds : undefined;
  }

  getTournament() {
    httpService.getTournament(this.numberOfTeams, this.teamsPerMatch).then(data => {
      if (data === undefined) {
        viewController.clear();
        return;
      }

      this.matchs = data.matchUps;
      this.tournamentId = data.tournamentId;
      this.currentMatchId = this.matchs.length;

      this.getTeamScore();
    });
  }

  getTeamScore(){
    this.matchs.forEach(match => {
      let results = {};

      match.teams = [];
      match.teamIds.forEach((teamId, index) => {
        httpService.getTeam(this.tournamentId, teamId).then(data => {
          if (data.error) {
            viewController.clear();
            return;
          }

          match.teams.push(data);

          // getwinner once fetch all teams' scores
          if (match.teams.length === this.teamsPerMatch) {
            this.getWinner(this.round, match);
          }
        });
      });
    });

  }

  getWinner(round, match){
    let matchId = this.countCurrentRoundMatchId(round, match.match);

    // fetch team score first
    httpService.getMatch(this.tournamentId, round, matchId).then(data => {
      if (data.error) {
        viewController.clear();
        return;
      }

      let matchScore = data.score;
      let teamScores = '';

      match.teams.forEach(team => teamScores += `teamScores=${team.score}&`); // end foreach

      // fetch team score after retrieve team score successful
      httpService.getWinner(this.tournamentId, teamScores, matchScore).then(data => {
        if (data.error) {
          viewController.clear();
          return;
        }

        let winner;
        match.teams.forEach(team => {
          if (team.score === data.score) {
            //In the event of a tie, the team with the lowest ID wins.
            if (winner !== undefined && team.teamId < winner.teamId) {
              winner = team;
            } else {
              winner = team;
            }
          }
        });

        match.winner = winner;
        viewController.markMatchComplete(match.match);

        if ((round + 1) === this.numberOfRounds) {
          // the last round, then display the winner;
          viewController.showWinner(match.winner);
        } else {
          // simulater next round
          let adjacentMatchs = this.findAdjacentMatchs(match, round);

          if (adjacentMatchs.length === this.teamsPerMatch - 1) {
            let nextRoundMatch = {
              match: this.currentMatchId++,
              teams: [match.winner],
            };

            adjacentMatchs.forEach(adjacentMatch => {
              nextRoundMatch.teams.push(adjacentMatch.winner);
            });

            this.matchs.push(nextRoundMatch);
            this.nextRound(round + 1, nextRoundMatch);
          }
        }
      });
    });// end httpService
  }

  findAdjacentMatchs(match, round) {
    let adjacentMatchs = [];
    let reminder = match.match % this.teamsPerMatch;

    for (let i = reminder; i > 0; i--) {
      let matchId = match.match - i;
      if (this.matchs[matchId].winner) {
        adjacentMatchs.push(this.matchs[matchId]);
      }
    }


    for (let x = 1; (match.match + x) % this.teamsPerMatch > 0; x++){
      let matchId = match.match + x;
      if (this.matchs[matchId] && this.matchs[matchId].winner) {
        adjacentMatchs.push(this.matchs[matchId]);
      }
    }

    return adjacentMatchs;
  }

  nextRound(round, match) {
    this.getWinner(round, match);
  }
}

var tournamentController  = new TournamentController();
