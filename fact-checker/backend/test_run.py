import asyncio
from graph import run_debate

async def test():
    print("Starting debate test...")
    async for event in run_debate("Coffee causes cancer"):
        print(event)
    print("Test finished.")

if __name__ == "__main__":
    asyncio.run(test())
