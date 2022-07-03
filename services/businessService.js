import { GraphQLClient, gql } from 'graphql-request'


class BusinessService {

    favs = [];
    businesses = [];

    fav(businessId) {
        if (!this.favs.includes(businessId)) {
            this.favs.push(businessId);
        }
    }

    isFav(businessId) {
        return this.favs.includes(businessId);
    }

    togglefav(businessId) {
        if (this.favs.includes(businessId)) {
            this.unFav(businessId);
        }
        else {
            this.fav(businessId);
        }
    }

    unFav(businessId) {
        var oldFavs = this.favs;
        this.favs = oldFavs.filter(function (value, index, oldFavs) {
            return value != businessId;
        });
    }

    loadBusiness(businesses) {
        this.businesses = businesses
    }

    async getBusiness(location, category) {
        //const endpoint = 'https://api.yelp.com/v3/graphql'
        const endpoint = 'http://localhost:3001'
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                authorization: 'Bearer A4E507JtrUPXMRowmYawjex8_HaW7RVEE6H4aTCCeOYel0DSj_IMQdqVTQmbw775h6I084XfFxWR7nAkKiQC10b-pSWiDnfkmtsOPDav5EP9Nug6OIQ3Yv8k0JB6YnYx',
            },
        })

        const query = gql`
            {
                
                search(location: "` + location + `", limit: 8, categories: "` + category + `") {
                    total
                    business {
                        id
                        name
                        url
                        rating
                        price
                        location {
                            address1
                            address2
                            address3
                            city
                            state
                            postal_code
                            country
                            formatted_address
                          }
                    }
                }
            }
        `

        try {
            const data = await graphQLClient.request(query);
            this.loadBusiness(data.search.business);
        } catch (error) {
            console.error(JSON.stringify(error, undefined, 2));
        }

        return this.businesses
    }
}

export default new BusinessService;