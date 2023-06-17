const reducer = (state, action) => {
  switch (action.type) {
    case "language":
      return { ...state, languages: action.payload };
    default:
      return state;
  }
};

export default reducer;
