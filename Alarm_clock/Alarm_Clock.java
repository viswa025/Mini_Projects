package Alarm_clock;

import javax.sound.sampled.*;
import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Scanner;
import java.io.File;




public class Alarm_Clock {

    public static void main(String[] args) {
        String Atime;
        LocalTime Alarmtime=null;
        String path="Alarm_clock/src/alarm.wav";
        


        DateTimeFormatter format=DateTimeFormatter.ofPattern("HH:mm:ss");
        Scanner scan = new Scanner(System.in);

        while(Alarmtime == null) {
            System.out.print("Enter a Time to set Alarm(hh:mm:ss):");
            Atime = scan.nextLine();
            try {
                Alarmtime = LocalTime.parse(Atime, format);
            }
            catch (DateTimeParseException e){
                System.out.println("Enter a valid Time");
            }



        }
        System.out.println("Alarm set at:"+Alarmtime);
        Alarm alarm= new Alarm(Alarmtime,path,scan);
        Thread thread=new Thread(alarm);
        thread.start();



    }
}


class Alarm implements Runnable{
    private final LocalTime AlarmTime;
    private final String path;
    private final Scanner scan;

    public Alarm(LocalTime AlamTime,String path,Scanner scan){
        this.AlarmTime=AlamTime;
        this.path=path;
        this.scan=scan;
    }

    @Override
    public void run() {

    while(LocalTime.now().isBefore(AlarmTime)){
        System.out.printf("\r%02d:%02d:%02d",
                LocalTime.now().getHour(),
                LocalTime.now().getMinute(),
                LocalTime.now().getSecond());
        try{
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            System.out.println("Thread got interrupted");
        }


    } System.out.println("\nTimes up");
        try {
            playsound();
        } catch (LineUnavailableException e) {
            throw new RuntimeException(e);
        }
    }
    private void playsound() throws LineUnavailableException {
        try(AudioInputStream audio= AudioSystem.getAudioInputStream(new File(path))){
            Clip clip=AudioSystem.getClip();
            clip.open(audio);
            clip.start();
            System.out.println("Press enter to stop");
            scan.nextLine();
            clip.stop();
        }
        catch (IOException e){
            System.out.println("Audio can't readable");
        } catch (UnsupportedAudioFileException e) {
            throw new RuntimeException(e);
        }
    }


}