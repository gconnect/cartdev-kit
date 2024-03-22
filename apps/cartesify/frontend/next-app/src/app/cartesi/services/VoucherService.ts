
const query = `
query {
  vouchers(last: 10) {
    edges{
      node{
        destination
        payload
        index
        input {
          index
        }
        proof {
          validity {
            inputIndexWithinEpoch
            outputIndexWithinInput
            outputHashesRootHash
            vouchersEpochRootHash
            noticesEpochRootHash
            machineStateHash
            outputHashInOutputHashesSiblings
            outputHashesInEpochSiblings
          }
          context
        }
      }
    }
  }
}
`

export class VoucherService {
    static async findAll() {
        const request = await fetch("http://localhost:8080/graphql", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,pt;q=0.8",
                "content-type": "application/json",
                "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Microsoft Edge\";v=\"122\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "http://localhost:8080/graphql",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
                operationName: null,
                query: query,
                variables: {}
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
        if (request.ok) {
            return await request.json()
        } else {
            throw new Error(`Query error ${request.status}: ${request.statusText}`)
        }
    }
}