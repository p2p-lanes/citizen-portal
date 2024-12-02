import { api } from "@/api"
import { getUser } from "../helpers/getData"
import { useCityProvider } from "@/providers/cityProvider"
import { filterAcceptedApplications, filterApplications } from "../helpers/filters"

type Status = 'draft' | 'import' | null

const useGetData = () => {
  const { getCity } = useCityProvider()
  const city = getCity()

  const getData = async () => {
    const email = getUser()
    if(email) {
      return api.get(`applications?email=${email}`)
    }

    return null
  }

  const getDataApplicationForm = async () => {
    const result = await getData();

    if(result?.status === 200) {
      const relevantApplication = filterApplications(result.data, city)
      if(relevantApplication) {
        return { application: relevantApplication, status: 'draft' }
      }

      const acceptedApplication = filterAcceptedApplications(result.data)
      if(acceptedApplication) {
        return { application: acceptedApplication, status: 'import' }
      }
    }

    return { application: null, status: null }
  }

  return ({
    getDataApplicationForm
  })
}
export default useGetData