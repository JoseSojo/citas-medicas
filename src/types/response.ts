
export interface RESPONSE_SERVICE {
    message:            string,
    jsonToResponse:     any,
    status:             string,
    errorMessage?:      string,
    successMessage?:    string,
}

export type GraphicPayload = `spaceCiteQuoteStatus` | `spaceCiteQuoteYear` | `spaceCiteQuoteMonth` | ``; 
