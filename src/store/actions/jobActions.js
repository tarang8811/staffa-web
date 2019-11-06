import Strings from '../../utilities/Strings'

export const createJob = project => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    firestore
      .collection(Strings.FS_COLLECTION_PROJECTS)
      .add({
        ...project,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        createdAt: new Date()
      })
      .then(() => {
        dispatch({ type: "CREATE_JOB_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "CREATE_JOB_ERROR" }, err);
      });
  };
};
