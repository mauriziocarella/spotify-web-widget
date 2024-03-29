import React, { useState } from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { Provider, useDispatch } from "react-redux"
import axios from "axios"

import store from "./redux"

import auth from "./redux/auth"

import "./scss/app.scss"

import LoginPage from "./views/login"
import HomePage from "./views/home"
import WidgetPage from "./views/widget"

const Authenticated = ({ children }: React.PropsWithChildren<{}>) => {
	const [loading, setLoading] = React.useState<boolean>(true)
	const [authenticated, setAuthenticated] = React.useState<boolean>(false)
	const dispatch = useDispatch()

	React.useEffect(() => {
		axios.get("/api/auth/me")
			.then(({ data: user }) => {
				dispatch(auth.set(user))

				setAuthenticated(true)
			})
			.finally(() => setLoading(false))
	}, [dispatch])

	if (loading) return null

	if (authenticated) {
		return (
			<>
				{children}
			</>
		)
	}

	return (
		<Redirect to={"/auth"}/>
	)
}

const Router = () => {
	return (
		<>
			<BrowserRouter basename={process.env.PUBLIC_URL}>
				<Switch>
					<Route path={"/auth/login"} component={LoginPage} exact/>
					<Redirect path={"/auth"} to={"/auth/login"} exact/>

					<Route path={"/widget/:id"} component={WidgetPage} exact/>

					<Authenticated>
						<Route path={"/home"} component={HomePage} exact/>

						<Redirect path={"/"} to={"/home"} exact/>
					</Authenticated>
				</Switch>
			</BrowserRouter>
		</>
	)
}

const App = () => {
	const [loading, setLoading] = useState(true)

	React.useEffect(() => {
		axios.defaults.baseURL = process.env.PUBLIC_URL

		setLoading(false)
	}, [])

	if (loading) return null

	return (
		<Provider store={store}>
			<Router/>
		</Provider>
	)
}

export default App
