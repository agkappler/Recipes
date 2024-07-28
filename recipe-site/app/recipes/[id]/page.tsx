// import { useRouter } from 'next/navigation';


export default async function Recipe({ params }: { params: { id: string } }) {
    const recipeData = await (await fetch(`http://localhost:8080/recipes/${params.id}`)).json();
    console.log(recipeData);
    console.log(params);
    return <>
        <h1>I am a recipe</h1>
        <p>{recipeData.name}</p>
    </>;
}