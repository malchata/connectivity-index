import { h, render } from "preact";
import FilterableCountryList from "./components/FilterableCountryList";
import stats from "./components/stats";

render(<FilterableCountryList stats={stats}/>, document.getElementById("main"));