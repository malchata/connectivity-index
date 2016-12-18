import { h, render } from "preact";
import FilterableCountryList from "./components/FilterableCountryList";
import stats from "./data/stats";

render(<FilterableCountryList stats={stats}/>, document.getElementById("main"));