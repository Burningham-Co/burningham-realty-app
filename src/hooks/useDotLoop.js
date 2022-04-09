import axios from "axios";
import { useEffect, useState } from "react";
// import { useQuery } from "react-query";

const useDotloop = (profileId) => {
  const [allLoops, setAllLoops] = useState(null);
  const [loading, setLoading] = useState(null);

  const allLoopsUrl =
    "https://us-central1-burningham-realty-agent-tools.cloudfunctions.net/allLoops";

  // const getAllLoops = () => {
  //   axios.get(allLoopsUrl).then((res) => res.data);
  // };

  // const { isLoading, isError, data, error } = useQuery("loops", getAllLoops);

  // if (isLoading) {
  //   setLoading(true);
  // } else {
  //   setLoading(false);
  // }

  useEffect(() => {
    if (profileId) {
      setLoading(true);
      axios
        .get(allLoopsUrl)
        .then((res) => res.data)
        .then((list) => {
          setLoading(false);
          setAllLoops(list);
          console.log(list);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  return { allLoops, loading };
};

export default useDotloop;
