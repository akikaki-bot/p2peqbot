import { Page, launch } from "puppeteer";
import { setTimeout } from "timers/promises"

export class ScreenShot {

    private uri : string 
    private page : Page;

    constructor( page : string ){
        this.uri = page;      

        this.powerOn();  
    }

    private async powerOn() : Promise<void> {
        if( typeof this.page === "object") return;
        const browser = await launch({
            headless : "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto( this.uri );
        this.page = page;
        console.log(`[Pupetter] ScreenShot Incetance Ready!`)

        browser.on("disconnected", async () => {
            console.log(`[Pupetter] Pupetter incetance has been disconnected. try to restart.`);
            await browser.close();
            await this.restart();
        })
    }

    private async restart() : Promise<void> {
        const browser = await launch({
            headless : "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto( this.uri );
        this.page = page;
        console.log(`[Pupetter] ScreenShot incetance has been restarted successfully.`)
    }

    async takeScreenShot() : Promise<Buffer> {
        const Buff = await this.page.screenshot({
            fullPage : true
        })
        await setTimeout( 900 )
        return Buff;
    }
}