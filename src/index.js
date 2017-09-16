import { h, render } from "preact";
import Styles from "./scss/styles.scss";
import FilterableCountryList from "./js/components/FilterableCountryList.js";
import stats from "./js/components/stats.js";

render(<FilterableCountryList stats={stats}/>, document.getElementById("main"));
