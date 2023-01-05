function successCallback(api, { events, status, callback, unsub }) {
  if (status.isFinalized) {
    // Filter for success events
    const eventList = events.filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event));
    if (eventList.length > 0) {
      if (callback) callback(); // If callback not undefined
      unsub();
    }
  }
}

export async function registerProfessionalHealth(api, pair, info, callback) {
  let unsub =  await api.tx.healthProfessional
    .register(info)
    .signAndSend(pair, { nonce: -1},
      ({ events, status}) => {
        successCallback(api, { events, status, callback, unsub });
      }
    )
}

export async function registerGeneticAnalystFee(api, pair, info) {
  return await api.tx.healthProfessional
    .register(info)
    .paymentInfo(pair)
}


export async function stakeProfessionalHealth(api, pair, callback) {
  let unsub =  await api.tx.healthProfessional
    .stake()
    .signAndSend(pair, { nonce: -1},
      ({ events, status}) => {
        successCallback(api, { events, status, callback, unsub });
      }
    )
}


export async function createHealtProfessionalQualification(api, pair, experiences, certifications, callback) {
  let unsub =  await api.tx.healthProfessionalQualification
    .create(experiences, certifications)
    .signAndSend(pair, { nonce: -1},
      ({ events, status}) => {
        successCallback(api, { events, status, callback, unsub });
      }
    )
}
