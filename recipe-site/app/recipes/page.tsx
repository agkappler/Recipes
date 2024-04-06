import Link from 'next/link';
import useSWR from 'swr';

export default async function Recipes() {
    // const [data, setData] = useState([]);
    let recipeData: any = [];

    await fetch('http://localhost:8080/recipe')
        .then(response => response.blob())
        .then(data => recipeData = data.text().toString());
    debugger;
    const recipes = [
        // ...recipeData,
        { id: 11, name: 'Chicken & Gnocchi Soup' },
        { id: 12, name: 'Kappler Chili' }
    ];
    
    return (
        <div>
            <h1>{recipeData}</h1>
            <ul>
                {recipes.map(r => (
                    <>
                        <li key={r.id}>
                            <Link href={`/recipes/${r.id}`}>{r.name}</Link>
                        </li>
                    </>
                ))}
            </ul>
        </div>
    );
}