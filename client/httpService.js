/*
 * type class
 * name HttpService
 */
"use strict";

class HttpService {
  constructor() {
    this.base = window.location.href;
    this.api = {
      winner: `${this.base}winner`,
      match: `${this.base}match`,
      team: `${this.base}team`,
      tournament: `${this.base}tournament`,
    };
  }

  ////////// public functions ////////////

  typeOf(object) {
    return Object.prototype.toString.call(object);
  }

  /*
   * type function
   * param numberOfTeams {Number}
   *       teamsPerMatch {Number}
   * return promise
   */
  getTournament(numberOfTeams, teamsPerMatch) {
    if (this.typeOf(numberOfTeams) !== '[object Number]' || this.typeOf(teamsPerMatch) !== '[object Number]'){
      let errorMSG = {error: "Oops, numberOfTeams or teamsPerMatch NaN!"};
      return errorMSG;
    }

    return fetch(`${this.api.tournament}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `numberOfTeams=${numberOfTeams}&teamsPerMatch=${teamsPerMatch}`
    }).then(function(response){
        if (!response.ok) {
          response.json().then(error => alert(error.message));
        } else {
          return response.json();
        }
    });
  }

  /*
   * type function
   * name getTeam
   * param tournamentId {Number}
   *       teamId {Number}
   * return promise
   */
   getTeam(tournamentId, teamId) {
     let url = `${this.api.team}?tournamentId=${tournamentId}&teamId=${teamId}`;

     return fetch(url).then(response => {
       if (!response.ok) {
         response.json().then(error => alert(error.message));
       } else {
         return response.json();
       }
     });
   }

   /*
    * type function
    * name getMatch
    * param tournamentId {Number}
    *       round {Number}
    *       matchId {Number}
    * return promise
    */
    getMatch(tournamentId, round, matchId) {
      let url = `${this.api.match}?tournamentId=${tournamentId}&round=${round}&match=${matchId}`;

      return fetch(url).then(response => {
        if (!response.ok) {
          response.json().then(error => alert(error.message));
        } else {
          return response.json();
        }
      });
    }

    /*
     * type function
     * name getWinner
     * param tournamentId {Number}
     *       teamScores {String} e.g. teamScores=1&teamScores=3&
     *       matchScore {Number}
     * return promise
     */
     getWinner(tournamentId, teamScores, matchScore) {
       let url = `${this.api.winner}?tournamentId=${tournamentId}&${teamScores}&matchScore=${matchScore}`;

       return fetch(url).then(response => {
         if (!response.ok) {
           response.json().then(error => alert(error.message));
         } else {
           return response.json();
         }
       });
     }
}

// export default HttpService;
const httpService = new HttpService();
