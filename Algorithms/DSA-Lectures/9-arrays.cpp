#include<iostream>
using namespace std;

void printArray(int arr[], int size){
    cout<<"Printing the Array: ";
    for(int i=0; i<size; i++){
        cout<<arr[i]<<" ";
    }
    cout<<"Printing Done!"<<endl;
}

int main()
{
    int num[15];

    //accessning an Array
    //cout<<"value at index 3 is "<<num[3];

    //intializing an Array
    int array[3]={11,4,7};
    //cout<<"value at index 2 is"<<array[2];
    //printArray(array, 3);

    int third[15]={2,5};
    //printArray(third, 15);
    
    int thirdSize= sizeof(third)/sizeof(int);
    //cout<<"Size of Third is:"<<thirdSize<<endl;

    //Not possible to initialise every value to 1 with below line 
    int fourth[10]={1};
    //printArray(fourth, 1);

    int FourthSize= sizeof(fourth)/sizeof(int);
    //cout<<"Size of Fourth is:"<<FourthSize<<endl;

    char ch[5]={'a','e','i','o','u'};
    return 0;
}