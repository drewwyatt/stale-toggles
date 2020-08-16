import axios from 'axios'

type DateString = string

type RolloutRule = {
  audience_conditions: string
  enabled: boolean
  percentage_included: number
}

type Environment = {
  id: number
  is_primary: boolean
  rollout_rules: RolloutRule[]
}

type Feature = {
  archived: boolean
  created: DateString
  description: string
  environments: Record<string, Environment>
  id: number
  key: string
  last_modified: DateString
  name: string
  project_id: number
  variables: unknown[]
}

type OptimizelyError = {
  code: string
  message: string
  uuid: string
}

export const getFeatures = async (project: string, token: string) => {
  const respose = await axios.get<Feature[]>(
    `https://api.optimizely.com/v2/features?project_id=${project}&per_page=99`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      responseType: 'json',
    },
  )

  if (respose.status === 200) {
    return respose.data
  }

  throw new Error(
    ((respose.data as unknown) as OptimizelyError)?.message ?? 'uh oh',
  )
}
