<script lang="ts">
  import HomePage from './pages/HomePage.svelte';
  import Header from './components/Header.svelte';
  import EditNotePage from './pages/EditNotePage.svelte';
  import { notes } from './stores/notes.store';
  import type { Note } from './types/app';

  import { Route, Router } from 'svelte-navigator';
  import PrivateRoute from './components/PrivateRoute.svelte';
  import AccountsPage from './pages/AccountsPage.svelte';

  let notesJSONString: string | null = localStorage.getItem('notes');
  let initNotes: Note[] = [];

  // TODO css responsive
  // https://www.section.io/engineering-education/creating-a-responsive-navigation-bar-using-tailwind-css-and-javascript/
  // https://www.geeksforgeeks.org/how-to-change-the-background-color-of-the-active-nav-item/

  // Notes initialization
  if (notesJSONString) {
    try {
      initNotes = JSON.parse(notesJSONString) as Note[];
    } catch (err) {
      console.error(err);
    }
  } else {
    initNotes = [
      {
        id: 1,
        title: 'Some Note',
        content: 'This note is about this and that',
        date: '20210806123021',
        isFavorite: false,
        tags: ['test', 'text'],
      },
      {
        id: 2,
        title: 'Another Note',
        content: 'This is yet another note about this and that',
        date: '20210806133021',
        isFavorite: false,
        tags: ['test', 'text', 'extra'],
      },
      {
        id: 3,
        title: 'Lorem ipsum',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in bibendum tellus. Aenean bibendum purus id turpis hendrerit tristique vitae nec lacus. Nam viverra elementum nisl. Donec non tempus arcu. Etiam iaculis ex nec hendrerit tincidunt. Vivamus elementum velit dui, non hendrerit purus condimentum ut. In convallis mauris eget consequat tempus. Pellentesque auctor a massa ac suscipit. Donec id metus suscipit, interdum tortor at, semper massa. Donec eget finibus purus, sed varius mi. Etiam a dui eget tortor auctor pulvinar eu ac lectus. Duis non diam molestie, efficitur massa non, suscipit massa. Etiam dictum eros quis ullamcorper scelerisque. Donec fermentum id ipsum vitae ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras pharetra diam sed fringilla dictum.',
        date: '20210804133021',
        isFavorite: true,
        tags: ['Lorem', 'ipsum'],
      },
    ];
  }

  $notes.push(...initNotes);
</script>

<Router>
  <Header />

  <Route path="/" component={HomePage} />

  <Route path="/accounts" component={AccountsPage} />

  <PrivateRoute path="note">
    <EditNotePage />
  </PrivateRoute>

  <PrivateRoute path="note/:id" let:params>
    <EditNotePage id={params.id} />
  </PrivateRoute>
</Router>

<style lang="scss">
  :root {
    height: 100%;
  }
</style>
