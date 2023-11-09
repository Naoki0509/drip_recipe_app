import { Button, Modal, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { GetServerSideProps } from 'next'
import nookies from 'nookies'

import { useRouter } from 'next/router'

import { Layout } from '~/Layout/layout'
import { RecipeCard } from '~/components/mol/Card/recipeCard'
import { CreateRecipeForm } from '~/components/org/newRecipeForm'
import { firebaseAdmin } from '~/libs/firebase/admin'
import { useAuthContext } from '~/libs/firebase/auth'

const Home = () => {
  const router = useRouter()
  const { Logout } = useAuthContext()

  return (
    <Layout>
      <Title className="py-12 text-center">Recipe List</Title>
      <RecipeList />
    </Layout>
  )
}

const RecipeList = () => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <RecipeCard />

      <Button onClick={open}>Create Recipe</Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Create Recipe"
        centered
        transitionProps={{
          transition: 'fade',
          duration: 200,
        }}
      >
        <CreateRecipeForm />
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = firebaseAdmin.auth()

  const cookies = nookies.get(ctx)

  const session = cookies.session || ''

  const user = await auth.verifySessionCookie(session, true).catch(() => null)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
}

export default Home
