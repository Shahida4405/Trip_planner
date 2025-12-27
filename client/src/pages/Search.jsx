import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SingleCard from "./components/SingleCard";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  // Fetch packages when query changes
  useEffect(() => {
    const fetchAllPackages = async () => {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = decodeURIComponent(urlParams.get("searchTerm") || "").trim();
        const offerFromUrl = urlParams.get("offer") === "true";
        const sortFromUrl = urlParams.get("sort") || "createdAt";
        const orderFromUrl = urlParams.get("order") || "desc";

        setSideBarSearchData({
          searchTerm: searchTermFromUrl,
          offer: offerFromUrl,
          sort: sortFromUrl,
          order: orderFromUrl,
        });

        urlParams.set("startIndex", 0);
        urlParams.set("limit", 8);

        const res = await fetch(`/api/package/get-packages?${urlParams.toString()}`);
        const data = await res.json();
        let packages = data?.packages || [];

        // Filter packages on frontend if searchTerm exists
        if (searchTermFromUrl) {
          packages = packages.filter((pkg) =>
            pkg.packageName.toLowerCase().includes(searchTermFromUrl.toLowerCase())
          );
        }

        setAllPackages(packages);
        setShowMoreBtn(packages.length >= 8);
      } catch (err) {
        console.error("Fetch Packages Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPackages();
  }, [location.search]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === "searchTerm") {
      setSideBarSearchData({ ...sideBarSearchData, searchTerm: value });
    } else if (id === "offer") {
      setSideBarSearchData({ ...sideBarSearchData, offer: checked });
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSideBarSearchData({ ...sideBarSearchData, sort, order });
    }
  };

  // Submit search
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarSearchData.searchTerm);
    urlParams.set("offer", sideBarSearchData.offer);
    urlParams.set("sort", sideBarSearchData.sort);
    urlParams.set("order", sideBarSearchData.order);
    navigate(`/search?${encodeURIComponent(urlParams.toString())}`);
  };

  // Show more packages
  const onShowMoreClick = async () => {
    const startIndex = allPackages.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    urlParams.set("limit", 8);

    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-packages?${urlParams.toString()}`);
      const data = await res.json();
      let packages = data?.packages || [];

      // Filter packages if searchTerm exists
      const searchTermFromUrl = decodeURIComponent(urlParams.get("searchTerm") || "").trim();
      if (searchTermFromUrl) {
        packages = packages.filter((pkg) =>
          pkg.packageName.toLowerCase().includes(searchTermFromUrl.toLowerCase())
        );
      }

      if (packages.length < 8) setShowMoreBtn(false);
      setAllPackages([...allPackages, ...packages]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">
              Search:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search"
              className="border rounded-lg p-3 w-full"
              value={sideBarSearchData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="offer" className="font-semibold">
              Type:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sideBarSearchData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort_order" className="font-semibold">
              Sort:
            </label>
            <select
              id="sort_order"
              onChange={handleChange}
              value={`${sideBarSearchData.sort}_${sideBarSearchData.order}`}
              className="p-3 border rounded-lg"
            >
              <option value="packagePrice_desc">Price high to low</option>
              <option value="packagePrice_asc">Price low to high</option>
              <option value="packageRating_desc">Top Rated</option>
              <option value="packageTotalRatings_desc">Most Rated</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-[#EB662B] rounded-lg text-white p-3 uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* Package Results */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold border-b p-3 text-slate-700 mt-5">
          Package Results:
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {loading && <p className="text-xl text-center w-full">Loading...</p>}
          {!loading && allPackages.length === 0 && (
            <p className="text-xl text-slate-700">No Packages Found!</p>
          )}
          {!loading &&
            allPackages.map((pkg) => <SingleCard key={pkg._id} packageData={pkg} />)}
        </div>

        {showMoreBtn && (
          <button
            onClick={onShowMoreClick}
            disabled={loading}
            className="text-sm bg-green-700 text-white hover:underline p-2 m-3 rounded text-center w-max"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
