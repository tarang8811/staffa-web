import Strings from '../../utilities/Strings'
import firebase from '../../config/fbConfig'

export const getBidsForJobId = (jobId, callBack) => {
  var bids = firebase
      .firestore()
      .collection(Strings.FS_COLLECTION_BIDS).where('jobId', '==', jobId);
  bids
    .get()
    .then(doc => {
      callBack(false, doc.docs.map(d => d.data()));
    })
    .catch(err => {
      callBack(true, null);
    });
}

