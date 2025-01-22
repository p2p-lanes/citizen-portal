import { useApplication } from "@/providers/applicationProvider"
import { useCityProvider } from "@/providers/cityProvider"
import { Resource } from "@/types/resources"
import { CircleDot, FileText, Home, Tag, Ticket, User, Users } from "lucide-react"

const useResources = () => {
  const { getCity } = useCityProvider()
  const { getRelevantApplication } = useApplication()
  const application = getRelevantApplication()
  const city = getCity()

  const resources: Resource[] = [
  {
    name: 'Application',
    icon: FileText,
    status: 'active',
    path: `/portal/${city?.slug}`,
    children: [
      {
        name: 'Status',
        status: 'inactive',
        value: application?.status ?? 'not started'
      }
    ]
  },
  {
    name: 'Passes',
    icon: Ticket,
    status: application?.status === 'accepted' ? 'active' : 'disabled',
    path: `/portal/${city?.slug}/passes`,
  },
  ...(city?.slug === 'edge-esmeralda' ? [{
    name: 'Attendee Directory', 
    icon: Users,
    status: 'active' as const,
    path: `/portal/${city?.slug}/attendees`,
  }] : []),
  {
    name: 'Housing',
    icon: Home,
    status: 'soon' as const
  }
]


  return ({resources})
}
export default useResources