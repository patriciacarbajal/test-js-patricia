import fetch from 'fetch-jsonp'
import moment from 'moment'

export function getPopularMovies () {
  return dispatch => {
    const fourStarUrl = 'https://itunes.apple.com/search?country=us&media=movie&entity=movie&limit=100&attribute=ratingIndex&term=4'
    const fiveStarUrl = 'https://itunes.apple.com/search?country=us&media=movie&entity=movie&limit=100&attribute=ratingIndex&term=5'
    const req1 = fetch(fourStarUrl)
    const req2 = fetch(fiveStarUrl)

    return Promise.all([req1, req2])
      .then(responses => responses.map(res => res.json()))
      .then(jsonPromises => Promise.all(jsonPromises))
      .then(jsonResponses => {
        //
        // jsonResponses contains the results of two API requests
        //

        //
        // 1. combine the results of these requests
        // 2. sort the results FIRST by year THEN by title (trackName)
        //
        const response = jsonResponses[0].results;
 

        const combinedResults = response.sort((a, b) => {
                                  const aYear = a['releaseDate'].slice(0,4),
                                  bYear = b['releaseDate'].slice(0,4),
                                  aTitle= a['trackName'],
                                  bTitle= b['trackName'],
                                  yearSort = aYear > bYear ? -1 : aYear < bYear ? 1 : 0;

                                  if (yearSort != 0)
                                    return yearSort;

                                  return aTitle < bTitle ? -1 : aTitle > bTitle ? 1 : 0; 
                                });

        return dispatch({
          type: 'GET_MOVIES_SUCCESS',
          movies: combinedResults
        })
    })
  }
}