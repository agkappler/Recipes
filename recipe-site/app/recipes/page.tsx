import Link from 'next/link';
import Recipe from '../models/Recipe';
// import useSWR from 'swr';

export default async function Recipes() {
    // const [data, setData] = useState([]);
    let recipeData: Recipe[] = [];

    const data = await fetch('http://localhost:8080/recipes')
        .then(response => response.json())
        .then(data => recipeData = data);

    return (
        <div>
            <ul>
                {recipeData.map(r => (
                    <>
                        <li key={r.recipeId}>
                            <Link href={`/recipes/${r.recipeId}`}>{r.name}</Link>
                        </li>
                    </>
                ))}
            </ul>
        </div>
    );
}